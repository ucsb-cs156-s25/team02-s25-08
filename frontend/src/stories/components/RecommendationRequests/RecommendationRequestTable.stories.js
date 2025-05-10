import React from "react";
import RecommendationRequestTable from "main/components/RecommendationRequests/RecommendationRequestTable";
import { recommendationRequestsFixtures } from "fixtures/recommendationRequestFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/RecommendationRequest/RecommendationRequestTable",
  component: RecommendationRequestTable,
};

const Template = (args) => <RecommendationRequestTable {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  requests: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.args = {
  requests: recommendationRequestsFixtures.fourRequests,
  currentUser: currentUserFixtures.userOnly,
};

export const FourItemsAdminUser = Template.bind({});
FourItemsAdminUser.args = {
  requests: recommendationRequestsFixtures.fourRequests,
  currentUser: currentUserFixtures.adminUser,
};
FourItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/recommendationrequests", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
