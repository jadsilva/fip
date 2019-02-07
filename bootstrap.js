(function(){
	'use strict'

	// Componentes
	const Filter = {
		data: function() {
			return {
				filter: null
			}
		},
		template:
			'<b-form-group horizontal label="Filter" class="mb-0">' +
			'	<b-input-group>' +
			'		<b-form-input v-model="filter" @input="$emit(\'filter-changed\', filter)" placeholder="Type to Search" />' +
			'		<b-input-group-append>' +
			'			<b-btn :disabled="!filter" @click="filter = \'\'">Clear</b-btn>' +
			'		</b-input-group-append>' +
			'	</b-input-group>' +
			'</b-form-group>'
	}

	const Marca = {
		data: function() {
			return {
				results: [],
				fields: [
					{key: 'codigo', label: 'Código', sortable: true},
					{key: 'nome', label: 'Marca', sortable: true},
					{key: 'modelosLink', label: 'Modelos', sortable: false}
				],
				filter: null,
				currentPage: 1,
				perPage: 6
			}
		},
		methods: {
			updateFilter: function (filter) {
				console.log('updateFilter: %s', filter)
				this.filter = filter;
			}
		},
		components: {
			'x-filter': Filter
		},
		template: 
			'<div class="marca">' +
			'	<h1>Marcas</h1>' +
			'	<x-filter @filter-changed="updateFilter"/>' +
			'	<b-table striped hover :items="results" :fields="fields" :per-page="perPage" :current-page="currentPage" :filter="filter">' +
			'		<template slot="modelosLink" slot-scope="data">' +
			'			<router-link :to="`/${data.item.codigo}/modelos`">Abrir</router-link>' +
			'		</template>' +
			'	</b-table>' +
			'	<b-pagination align="center" :total-rows="results.length" :per-page="perPage" v-model="currentPage"></b-pagination>' +
			'</div>',
		created: function() {
			const vm = this;
			axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas')
				.then(function (response) {
					vm.results = response.data;
				})
				.catch(function (error) {
					console.log(error);
				})
		}
	}
	const Modelo = {
		data: function() {
			return {
				results: [],
				fields: [
					{key: 'codigo', label: 'Código', sortable: true},
					{key: 'nome', label: 'Modelos', sortable: true},
					{key: 'anosLink', label: 'Anos', sortable: false}
				],
				currentPage: 1,
				perPage: 6
			}
		},
		components: {
			'x-filter': Filter
		},
		template: 
			'<div class="modelo">' +
			'	<h1>Modelos da Marca {{$route.params.codigo}}</h1>' +
			'	<b-table striped hover :items="results" :fields="fields" :per-page="perPage" :current-page="currentPage">' +
			'		<template slot="anosLink" slot-scope="data">' +
			'			<router-link :to="`/${$route.params.codigo}/modelos/${data.item.codigo}/anos`">Abrir</router-link>' +
			'		</template>' +
			'	</b-table>' +
			'	<b-pagination align="center" :total-rows="results.length" :per-page="perPage" v-model="currentPage"></b-pagination>' +
			'</div>',
		created: function() {
			const vm = this;
			axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas/' + vm.$route.params.codigo + '/modelos')
				.then(function (response) {
					vm.results = response.data.modelos;
				})
				.catch(function (error) {
					console.log(error);
				})
		}
	}

	const Ano = {
		data: function() {
			return {
				results: [],
				fields: [
					{key: 'codigo', label: 'Código', sortable: true},
					{key: 'nome', label: 'Modelos', sortable: true},
					{key: 'valorLink', label: 'Valores', sortable: false}
				],
				currentPage: 1,
				perPage: 6
			}
		},
		components: {
			'x-filter': Filter
		},
		template: 
			'<div class="modelo">' +
			'	<h1>Anos do Modelo {{$route.params.codigoModelo}} da Marca {{$route.params.codigoMarca}}</h1>' +
			'	<b-table striped hover :items="results" :fields="fields" :per-page="perPage" :current-page="currentPage">' +
			'		<template slot="valorLink" slot-scope="data">' +
			'			<router-link :to="`/${$route.params.codigoMarca}/modelos/${$route.params.codigoModelo}/anos/${data.item.codigo}`">Abrir</router-link>' +
			'		</template>' +
			'	</b-table>' +
			'	<b-pagination align="center" :total-rows="results.length" :per-page="perPage" v-model="currentPage"></b-pagination>' +
			'</div>',
		created: function() {
			const vm = this;
			axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas/' + vm.$route.params.codigoMarca + '/modelos/' + vm.$route.params.codigoModelo + '/anos')
				.then(function (response) {
					vm.results = response.data;
				})
				.catch(function (error) {
					console.log(error);
				})
		}
	}

	const Valor = {
		data: function() {
			return {
				infoArray: []
			}
		},
		template: 
			'<div class="modelo">' +
			'	<h1>Valor de tabela FIPE do Modelo {{$route.params.codigoModelo}} da Marca {{$route.params.codigoMarca}} do Ano {{$route.params.ano}}</h1>' +
			'	<b-container>' +
			'		<b-row v-for="info in infoArray">' +
			' 		<b-col>{{info[0]}}</b-col><b-col>{{info[1]}}</b-col>' +
			'		</b-row>' +
			'	</b-container>' +
			'</div>',
		created: function() {
			const vm = this;
			axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas/'
			+ vm.$route.params.codigoMarca + '/modelos/' + vm.$route.params.codigoModelo + '/anos/' + vm.$route.params.ano)
				.then(function (response) {
					vm.infoArray = Object.entries(response.data)
				})
				.catch(function (error) {
					console.log(error);
				})
		}
	}

	const router = new VueRouter({
		routes: [
			{ path: '/', component: Marca },
			{ path: '/:codigo/modelos', component: Modelo },
			{ path: '/:codigoMarca/modelos/:codigoModelo/anos', component: Ano },
			{ path: '/:codigoMarca/modelos/:codigoModelo/anos/:ano', component: Valor }
		]
	})

	const app = new Vue({
		el: '#app',
		router
	})
})()
