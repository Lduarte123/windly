import React from "react";
import { View, ScrollView, FlatList } from "react-native";
import FormularioLogin from "../../../components/formularioLogin/FormularioLogin";
// import FormulariCadastro from "../../../components/formularioCadastro/FormularioCadastro"
// import Logout from "../../../components/logout/logout";
export default function Login(){
    return(
    <ScrollView>
    <View>
        <FormularioLogin />
    </View>
    </ScrollView>
    )
}