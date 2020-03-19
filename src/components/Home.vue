<template>
  <div class="container">
    <nav>
      <span class="site-logo">🦠 Corona-tracker</span>
      <span class="nav-items">
        <ul>
          <li @click="handleAbout">🤔about</li>
        </ul>
      </span>
    </nav>
    <div class="about" v-if="showAbout">
      <div class="close" @click="handleClose">close</div>
      <div class="about-info">
        <p>
          Corona-tracker is an app that uses
          <a href="https://github.com/mathdroid/covid-19-api">COVID-19 API</a>
          to show current status of Coronavirus around the globe.
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
      <div class="map">
        <h1>🗺️Map</h1>
        <l-map :zoom="zoom" :center="center" style="height: 500px; width: 100%">
          <l-tile-layer :url="url" :attribution="attribution" />
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { latLng } from "leaflet";

export default {
  name: "Home",
  data() {
    return {
      showAbout: false,
      globalCases: null,
      globalDeaths: null,
      globalRecovered: null,
      zoom: 4,
      center: latLng(20.5937, 78.9629),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
  methods: {
    handleAbout() {
      this.showAbout = !this.showAbout;
    },
    handleClose() {
      this.showAbout = false;
    }
  },
  created() {
    // Get global data
    axios
      .get("https://covid19.mathdro.id/api")
      .then(res => {
        const data = res.data;
        this.globalCases = data.confirmed.value;
        this.globalRecovered = data.recovered.value;
        this.globalDeaths = data.deaths.value;
      })
      .catch(err => {
        console.error("Error fetching data from API.\n", err);
      });
  }
};
</script>

<style scoped>
.container {
  width: 95%;
  max-width: 1040px;
  margin: auto;
}
.nav-items {
  float: right;
}
nav {
  padding: 1.2rem;
  font-size: 1.2rem;
}
.nav-items > ul {
  list-style: none;
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

.map {
  border-radius: 10px;
  background-color: azure;
  padding: 1rem;
  margin-bottom: 2rem;
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
