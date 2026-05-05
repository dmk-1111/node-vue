<script setup>
  import Navbar from './Navbar.vue';
</script>
<template>
  <div class="about">
    <Navbar />
      <section id="about-us">
        <div class="container my-5">
          <div class="row">

            <div class="col-md-6">
            <div class="about-content title mb-3">
              <h2>
                About Us <br>
                Our History <br>
                Mission & Vision <br>
              </h2>
              <p class="mb-3">
                Blue Oasis Dive is a PADI dive centre located right on the beautiful beaches of Sanur, Bali. <br> Operating out of the Rip Curl School of Surf, we are the ultimate boutique dive experience. <br>With the best location, the highest standards for customer service, equipment, safety and environmental awareness, plus with all our other awesome activities, we can offer you an experience like no other.
              </p>
              <a href="#"><button class="btn btn-black">Learn More</button></a>
            </div>
          </div>

            <div class="col-md-6">
              <img src="https://source.unsplash.com/_STLYdogRF4/555x450" class="img-fluid" alt="">
            </div>
          </div>

        </div>
      </section>
  </div>
</template>

<style scoped>
  body {
    font-family: 'Raleway', sans-serif;
    background-color:#fff;
  }

  .about-content {
    max-width:800px;
    margin: 0 auto;
  }
  .about-content h2 {
    font-size: 30px;
    line-height:45px;
    margin-bottom: 30px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #333;
    text-transform: uppercase;
  }

  .about-content p {
    font-weight: 300;
    color: #777;
    font-size: 18px;
  }

  .about-content {
    padding-right:60px;
  }

  .btn-black {
    color:#fff;
    background-color:rgba(0,0,0,1);
    transition: 0.5s;
    border-radius:1;
  }

  .btn-black:hover {
    color:#fff;
    background-color:rgba(0,0,0,0.8);
    transition: 0.5s;
  }

  @media (max-width:576px) {
    .about-content {
      padding-right:0;
    }
    .about-content h2 {
      font-size:26px;
    }
    .about-content p {
      font-size:16px;
    }
  }
</style>
