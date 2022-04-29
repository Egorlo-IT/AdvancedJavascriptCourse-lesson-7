/*
  1. Привязать добавление товара в корзину к реальному API.
  2. Добавить API для удаления товара из корзины.
  3. * Добавить файл stats.json, в котором будет храниться статистика действий 
  пользователя с корзиной. В файле должны быть поля с названием действия 
  (добавлено/удалено), названием товара, с которым производилось действие 
  и временем, когда оно было совершено.
*/

const app = new Vue({
  el: "#app",
  data: {
    userSearch: "",
  },
  methods: {
    async getJson(url) {
      try {
        const result = await fetch(url);
        return await result.json();
      } catch (error) {
        this.$refs.error.setError(error);
      }
    },
    async postJson(url, data) {
      try {
        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return await result.json();
      } catch (error) {
        this.$refs.error.setError(error);
      }
    },
    async putJson(url, data) {
      try {
        const result = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return await result.json();
      } catch (error) {
        this.$refs.error.setError(error);
      }
    },
    async deleteJson(url) {
      try {
        const result = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        return await result.json();
      } catch (error) {
        this.$refs.error.setError(error);
      }
    },
  },
});
