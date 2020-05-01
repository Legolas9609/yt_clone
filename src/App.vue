<template>
    <main>
        <div id="app">
         <!--   <Header/>
            <router-view></router-view>
            <router-view name="reset"></router-view>
-->
        </div>
    </main>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
   // import Header from "./components/Header";

    export default {

        name: 'App',
        components: {
           // Header
        }
    }
</script>

<style>

    #app {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .title {
        text-align: start;
        line-height: 1.05;
        font-weight: 600 !important;
        transition: all .2s ease-in-out;
    }

    .author-nick {
        text-align: start;
        color: #606060;
    }

    .film-views {
        text-align: start;
        line-height: 0.6;
        color: #606060;
    }

    .m-nav-link a {
        color: rgba(0, 0, 0, .55) !important;
    }

    .m-nav-link a:hover {
        color: rgba(0, 0, 0, .7) !important;
        text-decoration: underline;
    }

    .m-nav-link a:active {
        background-color: rgba(0, 0, 0, 0) !important;
    }

    .m-container {
        cursor: pointer;
    }

    .middle {
        cursor: pointer;
        transition: .5s ease;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }

    .m-container:hover .image {
        opacity: 0.5;
    }

    .m-container:hover .middle {
        opacity: 1;
    }

    .playlist-add-icon-mobile {
        color: #2c3e50;
    }

    .playlist-add-icon {
        transition: .2s ease;
        opacity: 0;
        color: #2c3e50;
    }

    .film-preview-holder:hover .playlist-add-icon {
        opacity: 0.6;
    }

    .film-preview-holder:hover .dropdown-toggle:hover .playlist-add-icon {
        opacity: 1;
    }


    .m-add-dropdown .dropdown-menu {
        -webkit-box-shadow: 0px 18px 22px 5px rgba(0, 0, 0, 0.7);
        box-shadow: 0px 18px 22px 5px rgba(0, 0, 0, 0.7);
        width: 250px !important;
    }

    .dropdown-toggle-no-caret {
        padding: 0 !important;
        line-height: 0 !important;
    }

    .md-ripple-wave {
        color: #212529 !important;
        background-color: #212529 !important;
    }


</style>
