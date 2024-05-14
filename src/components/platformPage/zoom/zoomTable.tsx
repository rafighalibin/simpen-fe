import React from "react";
import { useQuery } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useAuthContext } from "../../../common/utils/authContext";
import { DataTable as ZoomDataTable } from "./zoom-data-table";
import { columns as ColumnsZoom } from "./columns";
import Loading from "../../../common/components/Loading";
import styles from "./ZoomTable.module.css";
import Link from "next/link";

import { ReadZoom } from "../../../common/types/platform";

export const ZoomTable = () => {
    const fetchWithToken = useFetchWithToken();
    const { pengguna } = useAuthContext();

    const { isLoading, error, data } = useQuery({
        queryKey: ["zoom"],
        queryFn: () => fetchWithToken("/platform?zoom").then((res) => res.json()),
    });

    if (isLoading) {
        return <Loading />;
    }

    const listZoom: ReadZoom[] = data.content;

    return(
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-center justify-between">
                <h1 className={` ${styles.heading} text-3xl font-bold my-10`}>Daftar Zoom</h1>
                <div className="flex items-right justify-end space-x-4">
                    <Link href="/platform/zoom/add">
                        <button className="px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded">
                            + Tambah Zoom
                        </button>
                    </Link>
                </div>
            </div>
            <div className={`${styles.card_form} px-6 py-8 mb-5`}>
                <ZoomDataTable columns={ColumnsZoom} data={listZoom} />
            </div>
        </div>
    );
};