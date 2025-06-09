import React from "react";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import styles from "../../../components/styles";
export default function App(){

    const [search, setSearch] = useState("");

    return(
        <ScrollView>
            <View style={styles.config}>
            <Text style={styles.fontConfig}>Configurações</Text>
            </View>

            <View style={styles.listConfig}>

            </View>
        </ScrollView>
        
    )
}