"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { UpdateTagForm } from "../../../../components/tagPage/updateTagForm";
import { useAuthContext } from "../../../../common/utils/authContext";
import { Breadcrumbs } from '../../../../components/breadcrumbs/breadcrumbs';


export default function App() {
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, true, false) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs/>
      <UpdateTagForm/>
    </div>
    )
  );
}
