import React from "react";
import { useQuery } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useAuthContext } from "../../../common/utils/authContext";
import { DataTable as RuanganDataTable } from "./ruangan-data-table";
import { columns as ColumnsRuangan } from "./columns";
import Loading from "../../../common/components/Loading";
import styles from "./RuanganTable.module.css";
import Link from "next/link";

import { ReadRuangan } from "../../../common/types/platform";

export const RuanganTable = () => {
    const fetchWithToken = useFetchWithToken();
    const { pengguna } = useAuthContext();

    const { isLoading, error, data } = useQuery({
        queryKey: ["ruangan"],
        queryFn: () => fetchWithToken("/platform?ruangan").then((res) => res.json()),
    });

    if (isLoading) {
        return <Loading />;
    }

    const listRuangan: ReadRuangan[] = data.content;

    return(
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-center justify-between">
                <h1 className={` ${styles.heading} text-3xl font-bold my-10`}>Daftar Ruangan</h1>
                <div className="flex items-right justify-end space-x-4">
                    <Link href="/platform/ruangan/add">
                        <button className="px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded">
                            + Tambah Ruangan
                        </button>
                    </Link>
                </div>
            </div>
            <div className={`${styles.card_form} px-6 py-8 mb-5`}>
                <RuanganDataTable columns={ColumnsRuangan} data={listRuangan} />
            </div>
        </div>
    );
};