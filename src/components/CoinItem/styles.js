import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    coinContainer: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        padding: 15
    },
    title: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
    },
    text: {
        color: "white",
        marginRight: 5
    },
    rank: {
        fontWeight: 'bold',
        color: 'white',
    },
    rankContainer: {
        backgroundColor: '#585858',
        paddingHorizontal: 5,
        borderRadius: 5,
        marginRight: 5
    }

})

export default styles;