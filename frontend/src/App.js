import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

// === UCSB Dates ===
import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

// === Restaurants ===
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

// === UCSB Organizations ===
import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

// === Recommendation Request ===
import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

// === Dining Commons Menu Items ===
import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

// === Articles ===
import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

// === Menu Item Reviews ===
import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

// === Placeholder ===
import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

// === Help Request ===
import HelpRequestIndexPage from "main/pages/HelpRequest/HelpRequestIndexPage";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />

        {/* Admin Only */}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <Route exact path="/admin/users" element={<AdminUsersPage />} />
        )}

        {/* ===== UCSB Dates ===== */}
        {hasRole(currentUser, "ROLE_USER") && (
          <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/ucsbdates/create"
              element={<UCSBDatesCreatePage />}
            />
            <Route
              exact
              path="/ucsbdates/edit/:id"
              element={<UCSBDatesEditPage />}
            />
          </>
        )}

        {/* ===== Recommendation Request ===== */}
        {hasRole(currentUser, "ROLE_USER") && (
          <Route exact path="/recommendationrequest" element={<RecommendationRequestIndexPage />} />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route exact path="/recommendationrequest/create" element={<RecommendationRequestCreatePage />} />
            <Route exact path="/recommendationrequest/edit/:id" element={<RecommendationRequestEditPage />} />
          </>
        )}

        {/* ===== UCSB Organizations ===== */}
        {hasRole(currentUser, "ROLE_USER") && (
          <Route
            exact
            path="/ucsborganizations"
            element={<UCSBOrganizationsIndexPage />}
          />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/ucsborganizations/create"
              element={<UCSBOrganizationsCreatePage />}
            />
            <Route
              exact
              path="/ucsborganizations/edit/:id"
              element={<UCSBOrganizationsEditPage />}
            />
          </>
        )}

        {/* ===== Restaurants ===== */}
        {hasRole(currentUser, "ROLE_USER") && (
          <Route exact path="/restaurants" element={<RestaurantIndexPage />} />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/restaurants/create"
              element={<RestaurantCreatePage />}
            />
            <Route
              exact
              path="/restaurants/edit/:id"
              element={<RestaurantEditPage />}
            />
          </>
        )}

        {/* ===== Dining Commons Menu Items ===== */}
        {hasRole(currentUser, "ROLE_USER") && (
          <Route
            exact
            path="/diningcommonsmenuitem"
            element={<UCSBDiningCommonsMenuItemIndexPage />}
          />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/diningcommonsmenuitem/create"
              element={<UCSBDiningCommonsMenuItemCreatePage />}
            />
            <Route
              exact
              path="/diningcommonsmenuitem/edit/:id"
              element={<UCSBDiningCommonsMenuItemEditPage />}
            />
          </>
        )}

        {/* ===== Articles ===== */}
        {hasRole(currentUser, "ROLE_USER") && (
          <Route exact path="/articles" element={<ArticlesIndexPage />} />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/articles/create"
              element={<ArticlesCreatePage />}
            />
            <Route
              exact
              path="/articles/edit/:id"
              element={<ArticlesEditPage />}
            />
          </>
        )}

        {/* ===== Menu Item Reviews ===== */}
        {hasRole(currentUser, "ROLE_USER") && (
          <Route
            exact
            path="/menuitemreviews"
            element={<MenuItemReviewIndexPage />}
          />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/menuitemreviews/create"
              element={<MenuItemReviewCreatePage />}
            />
            <Route
              exact
              path="/menuitemreviews/edit/:id"
              element={<MenuItemReviewEditPage />}
            />
          </>
        )}

        {/* ===== Placeholder ===== */}
        {hasRole(currentUser, "ROLE_USER") && (
          <Route exact path="/placeholder" element={<PlaceholderIndexPage />} />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/placeholder/create"
              element={<PlaceholderCreatePage />}
            />
            <Route
              exact
              path="/placeholder/edit/:id"
              element={<PlaceholderEditPage />}
            />
          </>
        )}

        {/* ===== Help Request ===== */}
        {hasRole(currentUser, "ROLE_USER") && (
          <Route exact path="/helprequest" element={<HelpRequestIndexPage />} />
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/helprequest/create"
              element={<HelpRequestCreatePage />}
            />
            <Route
              exact
              path="/helprequest/edit/:id"
              element={<HelpRequestEditPage />}
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
