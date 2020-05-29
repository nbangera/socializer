using System;
using System.Net.Http;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.User;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Infrastructure.Security
{
    public class FacebookAccessor:IFacebookAccessor    
    {
        
        private IOptions<FacebookAppSettings> _options;

        private readonly HttpClient _client;
        public FacebookAccessor(IHttpClientFactory httpclientFactory,IOptions<FacebookAppSettings> options)
        {           
            _client = httpclientFactory.CreateClient("facebook");
            _options = options;
        }

        public async Task<FacebookUserInfo> FacebookLogin(string accessToken)
        {
            var token = await _client.GetAsync($"debug_token?input_token={accessToken}&access_token={_options.Value.AppId} | {_options.Value.AppSecret}");

            if(token.IsSuccessStatusCode)
            return null;

            var result = await GetAsync<FacebookUserInfo>(accessToken,"me","fields=name,email,picture.width(100).height(100)");
            return result;
        }

        private async Task<T> GetAsync<T>(string accessToken, string endpoint, string args)
        {
            var response = await _client.GetAsync($"{endpoint}?accessToken={accessToken}&{args}");
            if(!response.IsSuccessStatusCode) 
            return default(T);

            var result = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(result);


              

        }
    }
}