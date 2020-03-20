import Vue from "vue";
import App from "./App.vue";
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import Toasted from "vue-toasted";

Vue.use(Toasted);

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component("l-tooltip", LTooltip);
import VueFlags from "@growthbunker/vueflags";

Vue.use(VueFlags);

// Fix for Icons, refer: https://vue2-leaflet.netlify.com/quickstart/#marker-icons-are-missing
import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
