import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Upload, X } from "lucide-react";
import { createProblemAPI } from "../api/problem";

interface CreateProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void; // 등록 완료 후 실행할 함수
}

const locations = [
  "본관 1층",
  "본관 2층",
  "본관 3층",
  "별관 1층",
  "별관 2층",
  "체육관",
  "도서관",
  "식당",
  "운동장",
  "화장실",
  "기타",
];

export function CreateProblemDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateProblemDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !location || !file) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("image", file);

    try {
      await createProblemAPI(formData); // ✅ FormData 전송
      alert("문제가 신고되었습니다!");
      onOpenChange(false);
      onSubmit();

      // 입력 초기화
      setTitle("");
      setDescription("");
      setLocation("");
      setFile(null);
      setImagePreview("");
    } catch (err) {
      console.error(err);
      alert("문제 신고 실패");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-[50%] left-[53%] -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto sm:max-w-[550px] bg-background border shadow-xl rounded-xl p-8">
        <DialogHeader>
          <DialogTitle>문제 신고하기</DialogTitle>
          <DialogDescription>
            학교 시설의 문제를 신고해주세요. 사진과 함께 자세히 설명해주시면
            빠른 해결에 도움이 됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <Label htmlFor="image">사진 *</Label>
            {imagePreview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 shadow-md">
                <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => {
                    setImagePreview("");
                    setFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="flex aspect-video w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-secondary/50 hover:border-primary hover:bg-secondary"
              >
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm">클릭하여 사진 업로드</p>
                  <p className="mt-1 text-xs text-muted-foreground">JPG, PNG 형식 지원</p>
                </div>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="예: 3층 화장실 문 고장"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2"
            />
          </div>

          {/* 위치 */}
          <div className="space-y-2">
            <Label htmlFor="location">위치 *</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="위치를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">상세 설명 *</Label>
            <Textarea
              id="description"
              placeholder="문제를 자세히 설명해주세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border-2"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>신고하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
