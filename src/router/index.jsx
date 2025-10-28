import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load page components
const BrowseProperties = lazy(() => import("@/components/pages/BrowseProperties"));
const SavedProperties = lazy(() => import("@/components/pages/SavedProperties"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <BrowseProperties />
      </Suspense>
    )
  },
  {
    path: "saved",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <SavedProperties />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);