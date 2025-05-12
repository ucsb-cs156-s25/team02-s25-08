package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;

import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@WebMvcTest(controllers = UCSBOrganizationsController.class)
@Import(TestConfig.class)
public class UCSBOrganizationsControllerTests extends ControllerTestCase {

    @MockBean
    UCSBOrganizationRepository ucsbOrganizationRepository;

    @MockBean
    UserRepository userRepository;

    // ========== AUTH TESTS ==========
    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
        mockMvc.perform(get("/api/ucsborganizations/all"))
               .andExpect(status().is(403));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void logged_in_users_can_get_all() throws Exception {
        mockMvc.perform(get("/api/ucsborganizations/all"))
               .andExpect(status().isOk());
    }

    @Test
    public void logged_out_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/ucsborganizations/post"))
               .andExpect(status().is(403));
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/ucsborganizations/post"))
               .andExpect(status().is(403));
    }

    // ========== CRUD TESTS ==========
    @WithMockUser(roles = {"USER"})
    @Test
    public void user_can_get_all_orgs() throws Exception {
        UCSBOrganization a = UCSBOrganization.builder()
                .orgCode("ZPR")
                .orgTranslationShort("ZETA PHI RHO")
                .orgTranslation("ZETA PHI RHO")
                .inactive(false)
                .build();
        UCSBOrganization b = UCSBOrganization.builder()
                .orgCode("SKY")
                .orgTranslationShort("SKYDIVING CLUB")
                .orgTranslation("SKYDIVING CLUB AT UCSB")
                .inactive(true)
                .build();
        List<UCSBOrganization> list = List.of(a, b);
        when(ucsbOrganizationRepository.findAll()).thenReturn(list);

        MvcResult res = mockMvc.perform(get("/api/ucsborganizations/all"))
                .andExpect(status().isOk()).andReturn();

        verify(ucsbOrganizationRepository, times(1)).findAll();
        assertEquals(mapper.writeValueAsString(list), res.getResponse().getContentAsString());
    }

    @WithMockUser(roles = {"ADMIN","USER"})
    @Test
    public void admin_can_post_new_org() throws Exception {
        UCSBOrganization org = UCSBOrganization.builder()
                .orgCode("ZPR")
                .orgTranslationShort("ZETA PHI RHO")
                .orgTranslation("ZETA PHI RHO")
                .inactive(true)
                .build();
        when(ucsbOrganizationRepository.save(eq(org))).thenReturn(org);

        MvcResult res = mockMvc.perform(post("/api/ucsborganizations/post?orgCode=ZPR&orgTranslationShort=ZETA PHI RHO&orgTranslation=ZETA PHI RHO&inactive=true").with(csrf()))
                .andExpect(status().isOk()).andReturn();

        verify(ucsbOrganizationRepository, times(1)).save(eq(org));
        assertEquals(mapper.writeValueAsString(org), res.getResponse().getContentAsString());
    }

    @WithMockUser(roles = {"USER"})
    @Test
    public void user_get_by_id_not_found() throws Exception {
        when(ucsbOrganizationRepository.findById("BAD")).thenReturn(Optional.empty());

        MvcResult res = mockMvc.perform(get("/api/ucsborganizations?orgCode=BAD"))
                .andExpect(status().isNotFound()).andReturn();
        verify(ucsbOrganizationRepository).findById("BAD");
        assertEquals("UCSBOrganization with id BAD not found", responseToJson(res).get("message"));
    }

    @WithMockUser(roles = {"ADMIN","USER"})
@Test
public void admin_can_edit_org() throws Exception {
    UCSBOrganization orig = UCSBOrganization.builder()
            .orgCode("ZPR")
            .orgTranslationShort("ZETA PHI RHO")
            .orgTranslation("ZETA PHI RHO")
            .inactive(true)
            .build();

    UCSBOrganization edited = UCSBOrganization.builder()
            .orgCode("ZPR")
            .orgTranslationShort("SKYDIVING CLUB")
            .orgTranslation("SKYDIVING CLUB AT UCSB")
            .inactive(false)
            .build();

    when(ucsbOrganizationRepository.findById("ZPR")).thenReturn(Optional.of(orig));
    when(ucsbOrganizationRepository.save(eq(edited))).thenReturn(edited);  // ✅ FIXED LINE

    String body = mapper.writeValueAsString(edited);

    MvcResult res = mockMvc.perform(
            put("/api/ucsborganizations?orgCode=ZPR")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body)
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    verify(ucsbOrganizationRepository).save(edited);
    assertEquals(body, res.getResponse().getContentAsString());
}
}