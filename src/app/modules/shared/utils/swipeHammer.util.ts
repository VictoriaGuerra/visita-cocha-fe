export function updateScrollRightContainer(event: any, container: any): void {
  if (!verifyMobileUser()) {
    container.nativeElement.scrollLeft -= event.distance;
  }
}

export function updateScrollLeftContainer(event: any, container: any): void {
  if (!verifyMobileUser()) {
    container.nativeElement.scrollLeft += event.distance;
  }
}

function verifyMobileUser(): boolean {
  let isMobileUser: boolean = false;

  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)) {
    isMobileUser = true;
  }

  return isMobileUser;
}
