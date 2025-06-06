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
public class UCSBOrganizationsWebIT extends WebTestCase {

    @Test
    public void admin_user_can_create_edit_delete_ucsborganizations() throws Exception {
        setupUser(true);

        page.getByText("UCSB Organizations").click();
        page.getByText("Create ucsborganizations").click();
        assertThat(page.getByText("Create New Organization")).isVisible();

        page.getByLabel("OrgCode").fill("ZPR");
        page.getByLabel("OrgTranslationShort").fill("ZETA PHI RHO");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("ZETA PHI RHO FRAT");
        page.getByLabel("Inactive").selectOption("false");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslation"))
                .hasText("ZETA PHI RHO FRAT");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSBOrganization")).isVisible();
        page.getByLabel("Inactive").selectOption("true");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-inactive")).hasText("true");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_ucsborganizations() throws Exception {
        setupUser(false);

        page.getByText("UCSB Organizations").click();

        assertThat(page.getByText("Create ucsborganizations")).not().isVisible();
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }
}
