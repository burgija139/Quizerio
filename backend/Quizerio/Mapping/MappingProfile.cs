using AutoMapper;
using Quizerio.Models;
using Quizerio.DTO;

namespace Quizerio.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Result, ResultDto>()
           .ForMember(dest => dest.Answers, opt => opt.MapFrom(src => src.Answers));

            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Quiz, QuizDto>().ReverseMap();
            CreateMap<Question, QuestionDto>().ReverseMap();
            CreateMap<RegisterDto, User>()
    .ForMember(dest => dest.ImageUrl, opt => opt.Ignore());
            CreateMap<UserAnswer, UserAnswerDto>();
        }
    }
}
