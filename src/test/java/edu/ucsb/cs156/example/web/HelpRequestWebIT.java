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
public class HelpRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_helprequest() throws Exception {
        setupUser(true);

        page.getByText("Help Requests").click();

        page.getByText("Create HelpRequest").click();
        assertThat(page.getByText("Create New HelpRequest")).isVisible();

        page.getByTestId("HelpRequestForm-requesterEmail").fill("ndalexander@ucsb.edu");
        page.getByTestId("HelpRequestForm-teamId").fill("s25-5pm-8");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("8");
        page.getByTestId("HelpRequestForm-requestTime").fill("2025-05-09T12:00");
        page.getByTestId("HelpRequestForm-explanation").fill("Need help formatting e2e tests");
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("ndalexander@ucsb.edu");

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requestTime"))
                .hasText("2025-05-09T12:00:00");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit HelpRequest")).isVisible();
        page.getByTestId("HelpRequestForm-solved").check();
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-solved")).hasText("true");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_restaurant() throws Exception {
        setupUser(false);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create HelpRequest")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }
}