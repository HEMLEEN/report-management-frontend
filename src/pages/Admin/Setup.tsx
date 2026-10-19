// import React from 'react'
// import CreationCards from './CreationCards'
// import Sidebar from '../../components/Sidebar'

// const Setup = () => {
//     return (
//         <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 m-2">
//             <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
//                 <CreationCards />
//             </div>
//         </main>
//     )
// }

// export default Setup

import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import AdminSetup from "./AdminSetup";

const Setup = () => {
    const navigate = useNavigate();

    return (
        <AdminSetup
            onCardClick={(card) => {
                navigate(card.path);
            }}
        />
    );
};

export default Setup;