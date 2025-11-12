import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { toast } from "sonner";

interface EditProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem: {
    id: number;
    title: string;
    description: string;
    location: string;
    imageUrl?: string;
  };
  onSubmit: (updatedData: {
    title: string;
    description: string;
    location: string;
    image?: File | null;
  }) => void;
}

const locations = [
  "가천관",
  "비전타워",
  "법과대학",
  "공과대학1",
  "공과대학2",
  "바이오나노대학",
  "한의과대학",
  "예술체육대학1",
  "예술체육대학2",
  "글로벌센터",
  "중앙도서관",
  "전자정보도서관",
  "대학원/(원격)평생교육원",
  "교육대학원",
  "산학협력관",
  "바이오나노연구원",
  "학생회관",
  "학생생활관",
  "AI관",
];

export function EditProblemDialog({
  open,
  onOpenChange,
  problem,
  onSubmit,
}: EditProblemDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (open && problem) { // 다이얼로그 열릴 때만 초기화
      setTitle(problem.title || "");
      setDescription(problem.description || "");
      setLocation(problem.location || "");
      setImagePreview(
        problem.imageUrl
          ? problem.imageUrl.startsWith("http")
            ? problem.imageUrl
            : `http://localhost:4002${problem.imageUrl}`
          : ""
      );
      setFile(null);
    }
  }, [open, problem]);


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
    if (!title || !description || !location) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    try {
      // 수정 요청 완료될 때까지 대기
      await onSubmit({
        title,
        description,
        location,
        image: file,
      });

      toast.success("문제가 수정되었습니다!");
      onOpenChange(false); // 이제 여기서 닫기
    } catch (err) {
      console.error(err);
      toast.error("문제 수정 중 오류가 발생했습니다.");
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-[50%] left-[53%] -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto sm:max-w-[550px] bg-background border shadow-xl rounded-xl p-8">
        <DialogHeader>
          <DialogTitle>문제 수정하기</DialogTitle>
          <DialogDescription>
            기존 신고 내용을 수정하거나 사진을 교체할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* 이미지 미리보기 */}
          <div className="space-y-2">
            <Label htmlFor="image">사진</Label>
            {imagePreview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 shadow-md">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
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
                  <p className="text-sm">클릭하여 새 사진 업로드</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG 형식 지원
                  </p>
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
          <Button onClick={handleSubmit}>수정 완료</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
