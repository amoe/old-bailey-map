package uk.ac.susx.shl.micromacro.resources;

import uk.ac.susx.shl.micromacro.jdbi.CachingDAO;
import uk.ac.susx.shl.micromacro.jdbi.ChunkCounter;
import uk.ac.susx.shl.micromacro.jdbi.DAO;
import uk.ac.susx.shl.micromacro.jdbi.PartitionedPager;
import uk.ac.susx.tag.method51.core.data.store2.query.Partitioned;
import uk.ac.susx.tag.method51.core.data.store2.query.Scoped;
import uk.ac.susx.tag.method51.core.data.store2.query.SqlQuery;

import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.logging.Logger;
import java.util.stream.Stream;



/**
 * Where request handlers utilise an AsyncResponse they must manage the life-cycle of the DAO response stream such that
 * the stream is closed after the response data is supplied. Regardless of whether the stream is consumed, it must be
 * closed. This class supplies the necessary stream life-cycled handling such that a simple handler method can provide
 * the required functionality for a given request.
 *
 */
public class DAOStreamResource<T, Q extends SqlQuery> {

    private static final Logger LOG = Logger.getLogger(DAOStreamResource.class.getName());

    protected final DAO<T, Q> datumDAO;
    private final ExecutorService executorService;

    protected DAOStreamResource(DAO<T, Q> datumDAO) {
        this.datumDAO = datumDAO;
        executorService = Executors.newFixedThreadPool(100);
    }

    protected boolean isPartitioned(Q query) {
        return query instanceof Partitioned && ((Partitioned) query).partition() != null;
    }

    protected boolean isScoped(Q query) {
        return query instanceof Scoped && ((Scoped) query).scope() != null;
    }

    protected boolean isScopedAndPartitioned(Q query) {
        return isPartitioned(query) && isScoped(query);
    }

    protected boolean isScopedOrPartitioned(Q query) {
        return isPartitioned(query) || isScoped(query);
    }

    protected boolean isCached(Q query) {
        boolean cached = false;
        CachingDAO<T, Q> cache = getCache();
        if(cache != null) {
            String id = cache.getQueryId(query);
            if(cache.isCached(id)) {
                cached = true;
            }
        }
        return cached;
    }
    protected CachingDAO<T, Q> getCache() {
        CachingDAO<T, Q> cache = null;
        if(datumDAO.getDAO() instanceof CachingDAO) {
            cache = (CachingDAO<T, Q>)datumDAO.getDAO();

        }
        return cache;
    }
    protected Map<Integer, int[]> getPages(Q query) {
        Map<Integer, int[]> pages = new HashMap<>();
        CachingDAO<T, Q> cache = getCache();
        if(cache != null) {
            String id = cache.getQueryId(query);
            if(cache.isCached(id)) {
                pages = cache.int2IntArr(id, PartitionedPager.ID2INTARR);
            }
        }
        return pages;
    }

    protected Map<String, Integer> getParitions(Q query) {
        Map<String, Integer> pages = new HashMap<>();
        CachingDAO<T, Q> cache = getCache();
        if(cache != null) {
            String id = cache.getQueryId(query);
            if(cache.isCached(id)) {
                pages = cache.str2Int(id, PartitionedPager.ID2PAGE);
            }
        }
        return pages;
    }


    protected Map<String, Integer> getChunkCounts(Q query) {
        Map<String, Integer> counts = new HashMap<>();
        CachingDAO<T, Q> cache = getCache();
        if(cache != null) {
            String id = cache.getQueryId(query);
            if(cache.isCached(id)) {
                counts = cache.str2Int(id, ChunkCounter.ID2COUNT);
            }
        }
        return counts;
    }

    /**
     * The intended use of AsyncResponse is to release the handling thread to the web framework for a long running
     * compute; however, it's being used here to allow for a callback after the stream has been consumed by the
     * framework.
     * @param asyncResponse
     * @param query
     * @param handler
     * @throws Exception
     */
    public void daoStreamResponse(final AsyncResponse asyncResponse, Q query, Function<Stream<T>, Object> handler) throws Exception {
        AtomicReference<Stream<T>> streamRef = new AtomicReference<>();
        AtomicBoolean complete = new AtomicBoolean(false);

        Supplier<Void> handle = () -> {
            try {

                List<BiFunction> functions = new ArrayList<>();

                if(isPartitioned(query)) {
                    Partitioned partitioned = (Partitioned) query;

                    functions.add(new PartitionedPager(partitioned.partition().key().toString()));
                } else if(isScoped(query)) {
                    Scoped scoped = (Scoped) query;

                    functions.add(new PartitionedPager(scoped.scope().key().toString()));
                }

                if(isScoped(query)) {
                    Scoped scoped = (Scoped) query;
                    functions.add(new ChunkCounter(scoped.scope().key().toString()));
                }

                Supplier<Object> task = () -> {
                    Stream<T> stream = datumDAO.stream(query, functions.toArray(new BiFunction[]{}));
                    streamRef.set(stream);
                    return handler.apply(stream);
                };

                CompletableFuture
                        .supplyAsync(task, executorService)
                        .thenApply(result -> Response.status(Response.Status.OK).entity(result).build())
                        .whenComplete((r, e) -> {
                            if (e != null) {
                                LOG.warning(e.getMessage());
                                asyncResponse.resume(e);
                            } else {
                                asyncResponse.resume(r);
                            }
                            if (streamRef.get() != null) {
                                streamRef.get().close();
                            }
                            complete.set(true);
                        }).get(); //must block
            } catch (InterruptedException | ExecutionException e) {
                if (streamRef.get() != null) {
                    streamRef.get().close();
                }
            } finally {
                if(streamRef.get()!=null && !complete.get()) {
                    streamRef.get().close();
                }
            }
            return null;
        };
        CompletableFuture
                .supplyAsync(handle, executorService)
                .exceptionally(e -> {
                    if(streamRef.get()!=null && !complete.get()) {
                        streamRef.get().close();
                    }
                    return null;
                });
    }
}
