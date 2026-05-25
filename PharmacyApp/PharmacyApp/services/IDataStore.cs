namespace PharmacyApp.services
{
    public interface IDataStore
    {
        Task<T> ReadAsync<T>(string fileName) where T : new();
        Task WriteAsync<T>(string fileName, T data);
    }
}
