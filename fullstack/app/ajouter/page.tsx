import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Ajouter from "@/components/Ajouter"
import AuthGuard from "@/components/AuthGuard"

export default function Home() {
    return <div>
           <Header /> 
           <AuthGuard>
               <Ajouter />
           </AuthGuard>
        <Footer />
    </div>
}