import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";

export default {
  title: "pages/UCSBOrganizations/UCSBOrganizationsIndexPage",
  component: UCSBOrganizationsIndexPage,
};

const Template = () => <UCSBOrganizationsIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly, { status: 200 }),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 }),
    ),
    http.get("/api/ucsborganizations/all", () =>
      HttpResponse.json([], { status: 200 }),
    ),
  ],
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither),
    ),
    http.get("/api/ucsborganizations/all", () =>
      HttpResponse.json(ucsbOrganizationsFixtures.threeUCSBOrganizations),
    ),
  ],
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.adminUser),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither),
    ),
    http.get("/api/ucsborganizations/all", () =>
      HttpResponse.json(ucsbOrganizationsFixtures.threeUCSBOrganizations),
    ),
    http.delete("/api/ucsborganizations", () =>
      HttpResponse.json(
        { message: "UCSB Organization deleted successfully" },
        { status: 200 },
      ),
    ),
  ],
};
