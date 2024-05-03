"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { DaftarTag } from "../../components/tagPage/daftarTag";
import { useAuthContext } from "../../common/utils/authContext";
import { Breadcrumbs } from '../../components/breadcrumbs/breadcrumbs';


export default function App() {
  const { checkPermission } = useAuthContext();
  return (
      <div className="px-[8vw] py-8">
        <Breadcrumbs/>
        
        <DaftarTag/>
    </div>
    )
}
