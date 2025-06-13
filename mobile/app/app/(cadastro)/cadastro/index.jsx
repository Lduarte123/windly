import React from "react";
import { View, ScrollView, FlatList } from "react-native";
//import FormularioLogin from "../../../components/formularioLogin/FormularioLogin";
import FormularioCadastro from "../../../components/formularioCadastro/FormularioCadastro"
// import Logout from "../../../components/logout/logout";
export default function Cadastro(){
    return(
    <ScrollView>
    <View>
        <FormularioCadastro/>
    </View>
    </ScrollView>
    )
}