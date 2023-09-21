namespace NwtCentral.Models
{
    public class ApiResponseModel
    {
        public int? Codigo { get; set; }
        public List<List<GeolocationModel>> Result { get; set; }
    }
    public class GeolocationModel
    {
        public int CodControlador { get; set; }
        public string TxtEquipamento { get; set; }
        public string Localizacao { get; set; }
        public string Data { get; set; }
        public string Hora { get; set; }
        public int Tempo { get; set; }
        public double NumLatitude { get; set; }
        public double NumLongitude { get; set; }
        public string DomStatus { get; set; }
        public int Plu { get; set; }
    }

}


