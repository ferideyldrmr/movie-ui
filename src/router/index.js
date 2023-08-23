import Vue from "vue";
import VueRouter from "vue-router";
import MovieView from "@/views/movie/Index.vue";

import MovieEdit from "@/views/movie/Edit.vue";

import ShowView from "@/views/show/Index.vue";
import ShowEdit from "@/views/show/Edit.vue";

import ActorEdit from "@/views/actor/Edit.vue";
import ActorView from "@/views/actor/Index.vue";
import '@fortawesome/fontawesome-free/css/all.css';
import CardView from '@/views/card/Index.vue';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CardView,
    props: {
      cardTitle: 'Ana Sayfa'
    }
  },
  {
    path: "/movies/:pageNumber?",
    name: "Movie",
    component: MovieView,
  },
  {
    path: "/movie/:id?",
    name: "Edit",
    component: MovieEdit,
  },

  {
    path: "/actors/:pageNumber?",
    name: "Actor",
    component: ActorView,
  },

  {
    path: "/actor/:id?",
    name: "EditActor",
    component: ActorEdit,
  },
  {
    path: "/shows/:pageNumber?",
    name: "Show",
    component: ShowView,
  },

  {
    path: "/show/:id?",
    name: "EditShow",
    component: ShowEdit,
  }, 
  // Buraya rotalarınızı tanımlayın
];

const router = new VueRouter({
  mode: "history", // İsteğe bağlı olarak history modunu kullanabilirsiniz
  routes,
});

export default router;
