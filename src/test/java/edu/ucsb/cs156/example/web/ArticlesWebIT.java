package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.beans.factory.annotation.Autowired;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;
import java.time.LocalDateTime;
import edu.ucsb.cs156.example.entities.Articles;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticlesWebIT extends WebTestCase {

    @Autowired
    ArticlesRepository articlesRepository;

    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

        Articles articles1 = Articles.builder()
                        .title("Using testing-playground with React Testing Library")
                        .url("https://dev.to/katieraby/using-testing-playground-with-react-testing-library-26j7")
                        .explanation("Helpful article about testing")
                        .email("phtcon@ucsb.edu")
                        .dateAdded(ldt)
                        .build();

        Articles savedArticle = articlesRepository.save(articles1);

        setupUser(true);

        page.getByText("Articles").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).hasText("Using testing-playground with React Testing Library");
        page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
    }


    @Test
    public void regular_user_cannot_create_article() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Articles")).not().isVisible();
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
    }
}