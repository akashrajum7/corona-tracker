<template>
  <div class="container">
    <nav>
      <span class="site-logo">🦠 Corona-tracker</span>
      <span class="nav-items">
        <ul>
          <li class="nav-padding">
            <a @click="updateData">🔄Refresh</a>
          </li>
          <li>
            <a @click="handleAbout">🤔about</a>
          </li>
        </ul>
      </span>
    </nav>
    <div class="about" v-if="showAbout">
      <div class="close" @click="handleClose">close</div>
      <div class="about-info">
        <p>
          Corona-tracker is an app that uses
          <a
            href="https://github.com/mathdroid/covid-19-api"
          >COVID-19 API</a>
          to show current status of Coronavirus around the globe. Indian data is
          retrieved from
          <a
            href="https://github.com/amodm/api-covid19-in"
          >api-covid-19-india</a>.
          <br />
          <br />
          <a href="https://github.com/akashrajum7/corona-tracker">Source code available on GitHub</a>.
        </p>
      </div>
    </div>
    <div class="body">
      <div class="global-cases">
        <h1>🌏Global Cases</h1>
        <div class="cases-sub">
          <div class="cases-confirmed">
            <span class="count">{{ globalCases }}</span> Confirmed
          </div>
          <div class="cases-recovered">
            <span class="count">{{ globalRecovered }}</span> Recovered
          </div>
          <div class="cases-deaths">
            <span class="count">{{ globalDeaths }}</span> deaths
          </div>
        </div>
      </div>
      <div class="indian-cases">
        <h1>🇮🇳India</h1>
        <div class="cases-sub">
          <div class="cases-confirmed">
            <span class="count">{{ indianCases }}</span> Confirmed
          </div>
          <div class="cases-recovered">
            <span class="count">{{ indianRecovered }}</span> Recovered
          </div>
          <div class="cases-deaths">
            <span class="count">{{ indianDeaths }}</span> deaths
          </div>
        </div>
      </div>
      <div class="map">
        <h1>🗺️Map</h1>
        <l-map
          :zoom="zoom"
          :center="center"
          :worldCopyJump="true"
          :min-zoom="minZoom"
          style="height: 500px; width: 100%"
        >
          <l-tile-layer :url="url" :attribution="attribution" />
          <l-marker
            v-for="data in indianMapData"
            :key="data.loc"
            :lat-lng="data.latlng"
            :icon="icon"
          >
            <l-tooltip
              :content="
                'State: ' +
                  data.loc +
                  '<br />' +
                  'Indian Cases: ' +
                  data.confirmedCasesIndian +
                  '<br />' +
                  'Foreign Cases: ' +
                  data.confirmedCasesForeign +
                  '<br />' +
                  'Discharged: ' +
                  data.discharged +
                  '<br />' +
                  'Deaths: ' +
                  data.deaths
              "
            ></l-tooltip>
          </l-marker>
          <l-marker
            :lat-lng="[data.lat, data.long]"
            v-for="data in worldMapData"
            :key="data.index"
            :icon="icon"
          >
            <l-tooltip
              :content="'Country: ' + data.countryRegion + '<br />' + 'State: ' + data.provinceState + '<br />' + 'Confirmed: ' + data.confirmed + '<br />' + 'Recovered: ' + data.recovered + '<br />' + 'Deaths: ' + data.deaths + '<br />' + 'Active: ' + data.active"
            ></l-tooltip>
          </l-marker>
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { latLng, icon } from "leaflet";

export default {
  name: "Home",
  data() {
    return {
      showAbout: false,
      globalCases: null,
      globalDeaths: null,
      globalRecovered: null,
      indianCases: null,
      indianDeaths: null,
      indianRecovered: null,
      worldMapData: [],
      indianMapData: [],
      indianLatLng: [
        [15.9129, 79.74],
        [25.0961, 85.3131],
        [21.2787, 81.8661],
        [28.7041, 77.1025],
        [22.2587, 71.1924],
        [29.0588, 76.0856],
        [31.1048, 77.1734],
        [15.3173, 75.7139],
        [10.8505, 76.2711],
        [22.9734, 78.6569],
        [19.7515, 75.7139],
        [20.9517, 85.0985],
        [11.9416, 79.8083],
        [31.1471, 75.3412],
        [27.0238, 74.2179],
        [11.1271, 78.6569],
        [18.1124, 79.0193],
        [30.7333, 76.7794],
        [34.083656, 74.797371],
        [34.209515, 77.615112],
        [26.8467, 80.9462],
        [30.0668, 79.0193],
        [22.9868, 87.855]
      ],
      zoom: 4,
      minZoom: 3,
      center: latLng(20.5937, 78.9629),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      icon: icon({
        iconUrl: "/microbe.png",
        iconSize: [25, 25],
        iconAnchor: [16, 37]
      })
    };
  },
  methods: {
    handleAbout() {
      this.showAbout = !this.showAbout;
    },
    handleClose() {
      this.showAbout = false;
    },
    updateData() {
      // Get global data
      axios
        .get("https://covid19.mathdro.id/api")
        .then(res => {
          const data = res.data;
          this.globalCases = data.confirmed.value;
          this.globalRecovered = data.recovered.value;
          this.globalDeaths = data.deaths.value;
          this.$toasted.success("Successfully updated global data.", {
            icon: "check",
            duration: 3000,
            keepOnHover: true
          });
        })
        .catch(err => {
          console.error("Error fetching data from API.\n", err);
          this.$toasted.error("Failed to updated global data.", {
            icon: "error",
            duration: 3000,
            keepOnHover: true
          });
        });

      // Get indian data
      axios
        .get("https://api.rootnet.in/covid19-in/stats/latest")
        .then(res => {
          const indianData = res.data;
          axios.get("https://covid19.mathdro.id/api/countries/in").then(res => {
            const indianSummary = res.data;
            this.indianCases = indianSummary.confirmed.value;
            this.indianRecovered = indianSummary.recovered.value;
            this.indianDeaths = indianSummary.deaths.value;
          });

          const regionalData = indianData.data.regional;
          let index;
          if (regionalData.length == this.indianLatLng.length) {
            for (index in regionalData) {
              this.indianMapData[index] = regionalData[index];
              this.indianMapData[index].latlng = this.indianLatLng[index];
            }
            this.$toasted.success("Successfully updated Indian data.", {
              icon: "check",
              duration: 3000,
              keepOnHover: true
            });
          } else {
            throw new Error("Location data has changed.");
          }
        })
        .catch(err => {
          console.error("Error fetching data from API.\n", err);
          this.$toasted.error("Failed to updated Indian data.", {
            icon: "error",
            duration: 3000,
            keepOnHover: true
          });
        });

      // Get global map data
      axios
        .get("https://covid19.mathdro.id/api/confirmed")
        .then(res => {
          this.worldMapData = res.data;
          this.$toasted.success("Successfully updated global map data.", {
            icon: "check",
            duration: 3000,
            keepOnHover: true
          });
        })
        .catch(err => {
          console.error("Error fetching data from API.\n", err);
          console.error("Error fetching data from API.\n", err);
          this.$toasted.error("Failed to updated global map data.", {
            icon: "error",
            duration: 3000,
            keepOnHover: true
          });
        });
    }
  },
  created() {
    this.updateData();
  }
};
</script>

<style scoped>
.container {
  width: 95%;
  max-width: 1040px;
  margin: auto;
}

nav {
  padding: 1.2rem;
  font-size: 1.2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.nav-items > ul {
  list-style: none;
}

.nav-items > ul > li > a {
  cursor: pointer;
}

.site-logo {
  font-weight: 600;
}
.close {
  float: right;
  padding-right: 1.2rem;
  cursor: pointer;
  padding-top: 0.6rem;
  text-decoration: underline;
  padding-bottom: 0.6rem;
}
.about-info {
  padding-left: 1.2rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.about {
  background-color: aliceblue;
  margin-bottom: 0.8rem;
  animation: slide-down 0.4s ease;
}

h1 {
  margin-bottom: 2rem;
}

.cases-sub {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  text-align: center;
  margin-bottom: 1rem;
}

.count {
  font-size: 2.5rem;
  font-weight: 800;
}

.global-cases {
  margin-top: 2rem;
  margin-bottom: 2rem;
  border-radius: 10px;
  background-color: azure;
  padding: 1rem;
}

.map,
.indian-cases {
  border-radius: 10px;
  background-color: azure;
  padding: 1rem;
  margin-bottom: 2rem;
}

.nav-items > ul {
  display: flex;
}

.nav-padding {
  padding-right: 1rem;
}

@media screen and (max-width: 500px) {
  .nav-items {
    margin-top: 1rem;
  }
  nav {
    display: grid;
    justify-content: space-around;
    padding-bottom: 0px;
  }
  .about-info {
    margin-top: 1rem;
  }
}

/* Slide down animation */
@keyframes slide-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>