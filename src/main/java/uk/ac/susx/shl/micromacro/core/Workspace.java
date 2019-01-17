package uk.ac.susx.shl.micromacro.core;

import uk.ac.susx.tag.method51.core.data.store2.query.DatumQuery;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Workspace implements Serializable {

    private final String id;
    private final String name;
    private final Map<String, Query> queries;

    public Workspace(String name) {
        id = UUID.randomUUID().toString();
        this.name = name;
        queries = new HashMap<>();
    }


    public String id() {
        return id;
    }

    public String name() {
        return name;
    }

    public <T extends DatumQuery> Workspace add(String name, T query) {
        if(!queries.containsKey(name)) {
            queries.put(name, new Query<T>());
        }

        queries.get(name).add(query);
        return this;
    }

    public Map<String, Query> queries(){

        return queries;
    }


}