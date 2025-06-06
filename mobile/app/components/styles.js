import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  whiteSection: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 16,
    paddingBottom: 110,
  },
  cidadesContainer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingTop: 24,
  },
  loading: {
    marginTop: 8,
  },
  erro: {
    color: "#E53935",
    alignSelf: "center",
    marginTop: 8,
  },
  scroll: {
    flex: 1,
    marginTop: 24,
    paddingBottom: 200,
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 24,
    marginBottom: 8,
  },
  vazio: {
    color: "#888",
    alignSelf: "center",
    marginTop: 32,
  },
  backContainer: {
    alignItems: "center",
    marginTop: 6,
    marginLeft: 12,
    backgroundColor: "#fff",
    width: '25',
    borderRadius: 100
  },
});

export default styles;
