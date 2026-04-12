import * as z from "zod";

export const linkSchema = z.object({
  title: z
    .string()
    .min(1, "링크 제목을 입력해주세요.")
    .max(50, "제목은 최대 50자까지 입력 가능합니다."),
  url: z
    .string()
    .min(1, "URL을 입력해주세요.")
    .refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
      message: "http 나 https로 시작하는 올바른 url을 추가하세요",
    })
    .refine(
      (val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "URL 형식이 올바르지 않습니다." }
    ),
});

export type LinkFormValues = z.infer<typeof linkSchema>;
