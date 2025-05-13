import { Routes, Route } from "react-router-dom";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersIndexPage from "main/pages/AdminUsersPage";

import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

import RestaurantsIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantsCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantsEditPage from "main/pages/Restaurants/RestaurantEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import HelpRequestsIndexPage from "main/pages/HelpRequest/HelpRequestIndexPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BasicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/admin/users" element={<AdminUsersIndexPage />} />

        <Route
          path="/ucsborganizations"
          element={<UCSBOrganizationsIndexPage />}
        />
        <Route
          path="/ucsborganizations/create"
          element={<UCSBOrganizationsCreatePage />}
        />
        <Route
          path="/ucsborganizations/edit/:id"
          element={<UCSBOrganizationsEditPage />}
        />

        <Route path="/restaurants" element={<RestaurantsIndexPage />} />
        <Route path="/restaurants/create" element={<RestaurantsCreatePage />} />
        <Route path="/restaurants/edit/:id" element={<RestaurantsEditPage />} />

        <Route path="/ucsbdates" element={<UCSBDatesIndexPage />} />
        <Route path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
        <Route path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />

        <Route path="/helprequests" element={<HelpRequestsIndexPage />} />
      </Route>
    </Routes>
  );
}

export default App;
