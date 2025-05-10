package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {

    @Test
    public void admin_user_can_create_edit_delete_recommendationrequest() throws Exception {
        setupUser(true); // true = admin

        // Navigate to index page
        page.getByText("RecommendationRequests").click();

        // Click "Create" and fill out form
        page.getByText("Create Recommendation Request").click();
        assertThat(page.getByText("Create New Recommendation Request")).isVisible();

        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("student@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("prof@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-explanation").fill("For graduate school.");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2022-04-20T00:00");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2022-05-01T00:00");
        page.getByTestId("RecommendationRequestForm-done").check();
        page.getByTestId("RecommendationRequestForm-submit").click();

        // Verify creation
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("student@ucsb.edu");

        // Click Edit
        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Recommendation Request")).isVisible();

        // Update explanation
        page.getByTestId("RecommendationRequestForm-explanation").fill("For scholarship.");
        page.getByTestId("RecommendationRequestForm-submit").click();

        // Verify update
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
                .hasText("For scholarship.");

        // Delete the entry
        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        // Verify deletion
        assertThat(page.getByTestId("RecommendationRequestTable")).not().containsText("student@ucsb.edu");
    }

    @Test
    public void regular_user_cannot_create_or_see_admin_features() throws Exception {
        setupUser(false); // false = regular user

        page.getByText("RecommendationRequests").click();

        // Admin-only buttons should be invisible
        assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
    }
}
