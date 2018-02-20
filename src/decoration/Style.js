const drawerWidth = 225;
const appbarheight = 56;

const Style = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
        flexGrow: 1
    },
    flexBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        textAlign: 'center'
    },
    drawerPaper: {
        position: 'relative',
        height: '100%',
        width: 240
    },

    space: {
        margin: 10
    },
    appbarh: {
        height: appbarheight
    },
    textcenter: {
        textAlign: 'center'
    },
    textformat: {
        whiteSpace: 'pre-line'
    }
});

export default Style