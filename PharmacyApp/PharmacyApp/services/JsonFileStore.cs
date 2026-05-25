
using System.Text.Json;

namespace PharmacyApp.services
{
    public class JsonFileStore : IDataStore
    {
        private readonly string _dataPath;
        private readonly SemaphoreSlim _semaphore = new(1, 1);
        private readonly JsonSerializerOptions _options;
        public JsonFileStore(IConfiguration configuration)
        {
            _dataPath = configuration["DataPath"] ?? "Data";
            if (!Directory.Exists(_dataPath))
            {
                Directory.CreateDirectory(_dataPath);
            }
            _options = new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNameCaseInsensitive = true,
            };
        }
        public async Task<T> ReadAsync<T>(string fileName) where T : new()
        {
            var filePath = Path.Combine(_dataPath, fileName);
            if (!File.Exists(filePath))
            {
                return new T();
            }
            try
            {
                var json = await File.ReadAllTextAsync(filePath);
                if(string.IsNullOrWhiteSpace(json))
                {
                    return new T();
                }
                return JsonSerializer.Deserialize<T>(json, _options) ?? new T();
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException($"Failed to deserialize {fileName}", ex);
            }
        }

        public async Task WriteAsync<T>(string fileName, T data)
        {
            var filePath = Path.Combine(_dataPath,fileName);
             await _semaphore.WaitAsync();
            try
            {
                var json = JsonSerializer.Serialize(data, _options);
                await File.WriteAllTextAsync(filePath, json);
            }
            finally
            {
                _semaphore.Release();

            }
        }
    }
}
