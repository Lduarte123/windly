import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    card: {
        backgroundColor: 'rgba(10, 10, 10, 0.2)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 16,
    },
    loading: {
        color: '#ccc',
        textAlign: 'center',
        padding: 20,
    },
    error: {
        color: '#ff5555',
        textAlign: 'center',
        padding: 20,
    },
    iconContainer: {
        alignItems: 'center',
        width: 48,
    },
    timeText: {
        fontSize: 10,
        color: "#ccc",
        marginTop: 4,
    },
});
