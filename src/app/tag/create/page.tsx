"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { TagForm } from "../../../components/tagPage/tagForm";
import { useAuthContext } from "../../../common/utils/authContext";
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';


export default function App() {
  const { checkPermission } = useAuthContext();
  return (
      <div className="px-[8vw] py-8">
        <Breadcrumbs/>
        <TagForm/>
    </div>
  );
}
