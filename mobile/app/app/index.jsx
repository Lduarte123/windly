import React from "react";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import MainSection from "../components/mainSection/MainSection";
import SearchBar from "../components/searchBar/SearchBar";
import MainStats from "../components/mainStats/MainStats";
import styles from "./styles";

export default function App(){

    const [search, setSearch] = useState("");

    return(
        <ScrollView style={styles.container}>
            <MainSection>
                <SearchBar value={search} onChangeText={setSearch} />
                <MainStats />
            </MainSection>
            <ScrollView style={styles.whiteSection}>
                
            </ScrollView>
        </ScrollView>
        
    )
}