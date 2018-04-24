package uk.ac.susx.shl.text.sequence;

import java.io.BufferedWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;

/**
 * Created by sw206 on 16/04/2018.
 */
public class Sandbox {

    public static void main(String[] args) throws Exception {

        GeoJsonKnowledgeBase knowledgeBase = new GeoJsonKnowledgeBase(Paths.get("LL_PL_PA_WA_POINTS_FeaturesT.json"));

        IOBColumnCandidateExtractor extractor = new IOBColumnCandidateExtractor(Paths.get("placeName.out"));

        Iterator<Candidate> itr = extractor.iterator();

        BufferedWriter writer = Files.newBufferedWriter(Paths.get("ob-places.csv"));

        writer.write("candidate,match,score");
        writer.newLine();

        while(itr.hasNext()) {

            Candidate candidate = itr.next();

            List<Match> matches = knowledgeBase.getMatches(candidate);

//            System.out.println(candidate.getText());

            for(Match match : matches) {

                double score = match.getScore();
                String text = match.getText();

                writer.write(match.getCandidate().getText().replaceAll(",", " "));
                writer.write(",");
                writer.write(text.replaceAll(",", " "));
                writer.write(",");
                writer.write(Double.toString(score));
                writer.newLine();

//                System.out.println(match.toString());
            }

//            System.out.println("================================================");



        }

        writer.close();

    }



}