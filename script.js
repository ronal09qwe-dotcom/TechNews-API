const contenedor = document.getElementById("contenedorNoticias");
const loader = document.getElementById("loader");
const buscador = document.getElementById("buscador");

let noticiasGuardadas = [];

// API
const url = "https://hacker-news.firebaseio.com/v0/topstories.json";

// Obtener noticias
async function obtenerNoticias() {

    try {

        const respuesta = await fetch(url);

        const ids = await respuesta.json();

        // Solo tomamos las primeras 20
        const primerosIds = ids.slice(0, 20);

        const noticias = await Promise.all(

            primerosIds.map(async (id) => {

                const respuestaNoticia = await fetch(
                    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
                );

                return await respuestaNoticia.json();

            })

        );

        noticiasGuardadas = noticias;

        mostrarNoticias(noticias);

        loader.style.display = "none";

    } catch (error) {

        loader.innerHTML = "Error al cargar noticias";

        console.log(error);

    }

}

// Mostrar noticias
function mostrarNoticias(noticias) {

    contenedor.innerHTML = "";

    noticias.forEach((noticia) => {

        const fecha = new Date(noticia.time * 1000);

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
        
            <h3>${noticia.title}</h3>

            <p><strong>Autor:</strong> ${noticia.by}</p>

            <p><strong>Fecha:</strong> ${fecha.toLocaleDateString()}</p>

            <a href="${noticia.url}" target="_blank">
                Leer noticia
            </a>
        
        `;

        contenedor.appendChild(card);

    });

}

// Buscador
buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase();

    const filtradas = noticiasGuardadas.filter((noticia) =>
        noticia.title.toLowerCase().includes(texto)
    );

    mostrarNoticias(filtradas);

});

// Iniciar
obtenerNoticias();