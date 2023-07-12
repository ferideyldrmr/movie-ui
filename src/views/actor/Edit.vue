<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ pageName }}</h5>
        <form @submit="submitForm">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              class="form-control"
              placeholder="Ex: Tom Hanks"
              v-model="actor.name"
            />
          </div>
          <div class="mb-3">
            <label for="desc" class="form-label">Surname</label>
            <input
              class="form-control"
              placeholder="Surname"
              v-model="actor.surname"
            />
          </div>
          <div class="mb-3">
            <label for="image" class="form-label">Actor image</label>
            <input
              class="form-control"
              placeholder="Cover thumb img"
              v-model="actor.actorImage"
            />
          </div>
    
          <button type="submit" class="btn btn-success">Save</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ActorEdit",
  data() {
    return {
      actor: {
        name: "",
        surname: "",
        actorImage: "",
      },
    //   years: [], // Array to hold the years
    };
  },

  methods: {
    getActorById() {
      if (this.routerActorId === 0) return;

      const apiUrl = `https://localhost:7092/api/actors/${this.routerActorId}`; // Replace with your API endpoint URL
      axios
        .get(apiUrl)
        .then((response) => {
          this.actor = response.data;
        })
        .catch((error) => {
          console.error("Failed to save actor:", error);
        });
    },
    submitForm(event) {
      event.preventDefault();

      if (this.routerActorId === 0) {
        this.addActor();
      } else {
        // Implement the logic for updating an existing movie
        this.updateActor();
      }
    },

    addActor() {
      const apiUrl = "https://localhost:7092/api/actors";
      axios
        .post(apiUrl, this.actor)
        .then(() => {
          this.$router.push({ name: "Actor" });
        })
        .catch((error) => {
          console.error("Actor kaydedilemedi:", error);
        });
    },

    updateActor() {
      const apiUrl = `https://localhost:7092/api/actors/${this.routerActorId}`;
      axios
        .put(apiUrl, this.actor)
        .then(() => {
          this.$router.push({ name: "Actor" });
          // Perform any additional actions upon successful save
        })
        .catch((error) => {
          console.error("Failed to save film:", error);
        });
    },
    // getYears() {
    //   const currentYear = new Date().getFullYear();
    //   const startYear = 1920;
    //   for (let year = currentYear; year >= startYear; year--) {
    //     this.years.push(year);
    //   }
    // },
  },
  computed: {
    routerActorId() {
      return this.$route.params.id ?? 0;
    },
    pageName() {
      return this.routerActorId === 0 ? "Add New Actor" : "Edit Actor";
    },
  },
  mounted() {
    this.getActorById();
    // this.getYears(); // Call the getYears method when the component is mounted
  },
};
</script>

<style></style>
