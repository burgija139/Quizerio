using AutoMapper;
using Quizerio.Models;
using Quizerio.DTO;

namespace Quizerio.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Result, ResultDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Quiz, QuizDto>().ReverseMap();
            CreateMap<Question, QuestionDto>().ReverseMap();
            CreateMap<RegisterDto, User>();
        }
    }
}
