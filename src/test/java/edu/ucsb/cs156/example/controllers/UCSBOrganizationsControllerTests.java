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

    @WithMockUser(roles = {"USER"})
    @Test
    public void user_get_by_id_success() throws Exception {
        UCSBOrganization org = UCSBOrganization.builder()
                .orgCode("ZPR")
                .orgTranslationShort("ZETA PHI RHO")
                .orgTranslation("ZETA PHI RHO")
                .inactive(true)
                .build();

        when(ucsbOrganizationRepository.findById("ZPR")).thenReturn(Optional.of(org));

        MvcResult res = mockMvc.perform(get("/api/ucsborganizations?orgCode=ZPR"))
                .andExpect(status().isOk()).andReturn();

        verify(ucsbOrganizationRepository).findById("ZPR");
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

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_can_post_new_org() throws Exception {
        UCSBOrganization org = UCSBOrganization.builder()
                .orgCode("ZPR")
                .orgTranslationShort("ZETA PHI RHO")
                .orgTranslation("ZETA PHI RHO")
                .inactive(true)
                .build();

        when(ucsbOrganizationRepository.save(eq(org))).thenReturn(org);

        MvcResult res = mockMvc.perform(post("/api/ucsborganizations/post?orgCode=ZPR&orgTranslationShort=ZETA PHI RHO&orgTranslation=ZETA PHI RHO&inactive=true")
                .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        verify(ucsbOrganizationRepository).save(eq(org));
        assertEquals(mapper.writeValueAsString(org), res.getResponse().getContentAsString());
    }

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_can_edit_org_success() throws Exception {
        UCSBOrganization original = UCSBOrganization.builder()
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

        when(ucsbOrganizationRepository.findById("ZPR")).thenReturn(Optional.of(original));
        when(ucsbOrganizationRepository.save(any())).thenReturn(edited);

        String body = mapper.writeValueAsString(edited);

        MvcResult res = mockMvc.perform(put("/api/ucsborganizations?orgCode=ZPR")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
                .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        verify(ucsbOrganizationRepository).save(any());
        assertEquals(body, res.getResponse().getContentAsString());
    }

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_cannot_edit_nonexistent_org() throws Exception {
        when(ucsbOrganizationRepository.findById("ZPR")).thenReturn(Optional.empty());

        UCSBOrganization edited = UCSBOrganization.builder()
                .orgCode("ZPR")
                .orgTranslationShort("SKYDIVING CLUB")
                .orgTranslation("SKYDIVING CLUB AT UCSB")
                .inactive(false)
                .build();

        String body = mapper.writeValueAsString(edited);

        MvcResult res = mockMvc.perform(put("/api/ucsborganizations?orgCode=ZPR")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
                .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        verify(ucsbOrganizationRepository).findById("ZPR");
        assertEquals("UCSBOrganization with id ZPR not found", responseToJson(res).get("message"));
    }

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_can_delete_org_success() throws Exception {
        UCSBOrganization org = UCSBOrganization.builder()
                .orgCode("ZPR")
                .orgTranslationShort("ZETA PHI RHO")
                .orgTranslation("ZETA PHI RHO")
                .inactive(true)
                .build();

        when(ucsbOrganizationRepository.findById("ZPR")).thenReturn(Optional.of(org));

        MvcResult res = mockMvc.perform(delete("/api/ucsborganizations?orgCode=ZPR").with(csrf()))
                .andExpect(status().isOk()).andReturn();

        verify(ucsbOrganizationRepository).delete(org);
        assertEquals("UCSB Organization with id ZPR deleted", responseToJson(res).get("message"));
    }

    @WithMockUser(roles = {"ADMIN", "USER"})
    @Test
    public void admin_delete_org_not_found() throws Exception {
        when(ucsbOrganizationRepository.findById("BAD")).thenReturn(Optional.empty());

        MvcResult res = mockMvc.perform(delete("/api/ucsborganizations?orgCode=BAD").with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        verify(ucsbOrganizationRepository).findById("BAD");
        assertEquals("UCSBOrganization with id BAD not found", responseToJson(res).get("message"));
    }
}