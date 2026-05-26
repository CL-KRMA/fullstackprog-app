import Accueil from "@/components/Accueil"
import Footer from "../components/Footer"
import Header from "../components/Header"
import ImageList from "@/components/ImageList"
import AuthGuard from "@/components/AuthGuard"
import Ajouter from "@/components/Ajouter"

export default function Home() {
    return <div>
        <Header />
        <Accueil /> 
        <ImageList />
        <AuthGuard>
        <Ajouter />
        </AuthGuard>     
        <Footer />
    </div>
    
}