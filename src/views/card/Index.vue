<template>
  <div class="card-view">
    <div class="card-group">
      <router-link :to="{ name: 'Movie' }" class="card" style="width: 18rem">
        <img
          class="card-img-top"
          src="https://www.karel.com.tr/sites/default/files/pictures/ik-film-onerileri-a.jpg"
          alt="Card image cap"
        />
        <div class="card-body">
          <h5 class="card-title">Movies</h5>
        </div>
      </router-link>

      <router-link :to="{ name: 'Show' }" class="card" style="width: 18rem">
        <img
          class="card-img-top"
          src="https://www.karel.com.tr/sites/default/files/pictures/ik-film-onerileri-a.jpg"
          alt="Card image cap"
        />
        <div class="card-body">
          <h5 class="card-title">TV Shows</h5>
        </div>
      </router-link>

      <router-link :to="{ name: 'Actor' }" class="card" style="width: 18rem">
        <img
          class="card-img-top"
          src="https://www.karel.com.tr/sites/default/files/pictures/ik-film-onerileri-a.jpg"
          alt="Card image cap"
        />
        <div class="card-body">
          <h5 class="card-title">Actors</h5>
        </div>
      </router-link>
    </div>
  </div>
</template>


<script>
export default {
  name: "CardView",
  props: {
    cardTitle: String,
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f0f0f0;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}

.card-title {
  margin: 0;
  font-size: 18px;
}

.card-content {
  padding: 10px 0;
}
</style>
