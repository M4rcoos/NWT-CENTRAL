using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using NwtCentral.Models;
using System.Globalization;
using System.Text;

namespace NwtCentral.Controllers
{
    public class GeolocationController : Controller
    {
        //criando a url de conexão com a api
        private readonly string ENDPOINT = "http://192.168.0.22/webresttnwpdOtto_Manaus/api/Query";
        //objeto que permitira a conexão entre a web com Api
        private readonly HttpClient httpClient = null;

        //criando o construtor
        public GeolocationController()
        {
            //instacia do objeto 
            httpClient = new HttpClient();
            //setando uma props do obj
            httpClient.BaseAddress = new Uri(ENDPOINT);
        }

        //chamada assincrona / tipando o IActionResult como retorno 
        public async Task<IActionResult> Index()
        {
            try
            {
                //criando uma lista com os dados da geolocations 
                List<GeolocationModel> geolocations = new List<GeolocationModel>();

                // Criando um objeto DadosParaEnvio com os dados a serem enviados
                var dataForRequest = new SendHttpPostModel
                {
                    Consulta = "SelStatus",
                    Parametros = "",
                    Tipo = "J"
                };
                 
                // Serializa os dados em formato JSON
                var jsonContent = new StringContent(JsonConvert.SerializeObject(dataForRequest), Encoding.UTF8, "application/json");

                //O Primeiro parametro da função PostAsync é a url da Api, o segundo é os dados que devem ser enviado!
                HttpResponseMessage response = await httpClient.PostAsync(ENDPOINT, jsonContent);
                //verificando se houve algum erro na resposta 
                if (response.IsSuccessStatusCode)
                {
                    // Configurar o formato da data
                    var settings = new JsonSerializerSettings
                    {
                        DateFormatString = "dd/MM/yyyy", // Define o formato da data
                        Converters = { new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.None } } // Ignora o formato ISO8601
                    };


                    string content = await response.Content.ReadAsStringAsync();
                    ApiResponseModel apiResponse = JsonConvert.DeserializeObject<ApiResponseModel>(content, settings);

                    // Agora você pode acessar a lista de GeolocationModel dentro do objeto apiResponse
                    List<GeolocationModel> geolocationList = apiResponse.Result[0];

                    string json = JsonConvert.SerializeObject(geolocationList);
                    ViewBag.JsonData = json;


                    return View(geolocationList);
                }
                else
                {
                    ModelState.AddModelError(null, "Erro ao executar essa ação!");
                }
                //retornando os dados 
                return View(geolocations);
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                throw;
            }
        }
    }
}