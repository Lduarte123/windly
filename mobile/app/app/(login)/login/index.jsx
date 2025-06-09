import React from "react";
import { View, ScrollView, FlatList } from "react-native";
import FormularioLogin from "../../../components/formularioLogin/FormularioLogin";

export default function Login(){
    return(
    <ScrollView>
    <View>
        <FormularioLogin />
    </View>
    </ScrollView>
    )
}