import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: ["mdi"],
  },
  theme: {
    themes: {
      light: {
        primary: colors.blueGrey.darken1, // #E53935
        secondary: colors.lightBlue.lighten1, // #FFCDD2
        accent: colors.deepOrange.lighten4, // #3F51B5
      },
      dark: {
        primary: colors.blueGrey.lighten4, // #E53935
        secondary: colors.blueGrey.darken1, // #FFCDD2
        accent: colors.deepOrange.lighten4, // #3F51B5
      },
    },
  },
});
