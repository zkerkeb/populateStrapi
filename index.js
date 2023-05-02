const {faker} = require('@faker-js/faker');
const axios = require('axios');
// SET THE LOCALE OF THE RANDOM DATA
faker.locale = 'fr';
// SET THE URL OF THE ENDPOINT
const url = 'http://localhost:1337/api/animal-phonebooks';
// SET THE NUMBER OF DATA TO GENERATE
const numberOfData = 1000

const generateRandomData = () => {
  // GENERATE RANDOM DATA
  // VOIR LA DOCUMENTAION DE FAKER
  const name = faker.animal.type()
  const photo = faker.image.animals(name)
  const telephone = faker.phone.number('+33 6 ## ## ## ##')

  // CHOISIR LES DATAS A GENERE SELON LA STRUCTURE DE L'ENDPOINT
  return {
    name,
    photo,
    telephone,
  };
};

const addDataToStrapi = async (data) => {
  axios({
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      
    },
    data:{
      data:{
      name: data.name,
      photo: data.photo,
      telephone: data.telephone,
      }
    },
  }).then(res => {
    console.log(`Données envoyées à Strapi :`, res.data);
  }).catch(err => {
    console.log(`Erreur lors de l'envoi des données à Strapi :`, err.message);
  });

};

const main = async () => {
  const randomData = generateRandomData();
  await addDataToStrapi(randomData);
};

const deleteAllData = async (id, isError) => {
  if (isError) {
    return
  }
  axios({
    method: 'DELETE',
    url: `${url}/${id}`,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => {
    console.log(`Données supprimées de Strapi :`, res.data);
    deleteAllData(id + 1, false)
  }).catch(err => {
    deleteAllData(id + 1, true)
    console.log(`Erreur lors de la suppression des données de Strapi :`, err.message);
  });
};

const getFirstId = async () => {
   const id = await axios({
    method: 'GET',
    url:  url,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => {
    return res.data.data[0].id
  }).catch(err => {
    console.log(`Erreur lors de la récupération des données de Strapi :`, err.message);
  });
  console.log('id', id)
  return id
};


const deleteAllDataFromEndpoint = async () => {
  const firstId = await getFirstId()
  deleteAllData(firstId, false)
}

const populateEndpointWithData = async () => {
  for (let i = 0; i < numberOfData; i++) {
    main();
  }
}

// DECOMMENTER LA FONCTION A EXECUTER
// populateEndpointWithData()
// deleteAllDataFromEndpoint()